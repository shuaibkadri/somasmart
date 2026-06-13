-- ============================================
-- SOMASMART DATABASE SCHEMA
-- ============================================

-- SUBJECTS (e.g. Physics, Mathematics)
create table subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- TOPICS (e.g. Mechanics, Electricity)
create table topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

-- SUBTOPICS (e.g. Kinematics, Forces)
create table subtopics (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

-- QUESTIONS
create table questions (
  id uuid primary key default gen_random_uuid(),
  subtopic_id uuid references subtopics(id) on delete cascade not null,
  question_type text not null default 'mcq' check (question_type in ('mcq', 'long')),
  tier text not null default 'core' check (tier in ('core', 'challenge')),
  source_syllabus text not null default 'NECTA', -- NECTA, textbook, KCSE, IB, etc.
  question_text text not null,
  options jsonb,                 -- for MCQ: {"A": "...", "B": "...", "C": "...", "D": "..."}
  correct_answer text,           -- for MCQ: "A" / "B" / etc.
  explanation text,              -- optional explanation shown after answering
  model_answer_text text,        -- for long questions
  marking_scheme jsonb,          -- for long questions: structured marking points
  year integer,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz default now()
);

-- USERS (extends Supabase auth.users with app-specific profile data)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone_number text,
  name text,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  form_level text, -- e.g. 'Form 4', 'Form 6'
  subscription_status text not null default 'free' check (subscription_status in ('free', 'paid')),
  subscription_expires_at timestamptz,
  xp_total integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_practice_date date,
  created_at timestamptz default now()
);

-- CLASSES (teacher feature)
create table classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  join_code text unique not null,
  created_at timestamptz default now()
);

-- CLASS MEMBERSHIPS (students joining a class)
create table class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(class_id, student_id)
);

-- ATTEMPTS (every time a student answers a question)
create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  question_id uuid references questions(id) on delete cascade not null,
  selected_answer text,          -- for MCQ
  self_rating text,               -- for long questions: 'correct'/'partial'/'incorrect'
  is_correct boolean,
  points_awarded integer default 0,
  attempted_at timestamptz default now()
);

-- ============================================
-- INDEXES for common queries
-- ============================================
create index idx_topics_subject on topics(subject_id);
create index idx_subtopics_topic on subtopics(topic_id);
create index idx_questions_subtopic on questions(subtopic_id);
create index idx_questions_tier on questions(tier);
create index idx_attempts_user on attempts(user_id);
create index idx_attempts_question on attempts(question_id);
create index idx_class_members_class on class_members(class_id);
create index idx_class_members_student on class_members(student_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table attempts enable row level security;
alter table classes enable row level security;
alter table class_members enable row level security;
alter table subjects enable row level security;
alter table topics enable row level security;
alter table subtopics enable row level security;
alter table questions enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Teachers can view profiles of students in their classes
create policy "Teachers can view their students profiles" on profiles
  for select using (
    exists (
      select 1 from class_members cm
      join classes c on c.id = cm.class_id
      where cm.student_id = profiles.id and c.teacher_id = auth.uid()
    )
  );

-- Subjects/topics/subtopics/questions: readable by everyone logged in
create policy "Authenticated users can view subjects" on subjects
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view topics" on topics
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view subtopics" on subtopics
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view questions" on questions
  for select using (auth.role() = 'authenticated');

-- Attempts: users can insert/view their own attempts
create policy "Users can view own attempts" on attempts
  for select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on attempts
  for insert with check (auth.uid() = user_id);

-- Teachers can view attempts of students in their classes
create policy "Teachers can view student attempts" on attempts
  for select using (
    exists (
      select 1 from class_members cm
      join classes c on c.id = cm.class_id
      where cm.student_id = attempts.user_id and c.teacher_id = auth.uid()
    )
  );

-- Classes: teachers manage their own classes
create policy "Teachers can view own classes" on classes
  for select using (auth.uid() = teacher_id);
create policy "Teachers can create classes" on classes
  for insert with check (auth.uid() = teacher_id);

-- Class members: students can join, teachers can view their class members
create policy "Students can view own memberships" on class_members
  for select using (auth.uid() = student_id);
create policy "Students can join classes" on class_members
  for insert with check (auth.uid() = student_id);
create policy "Teachers can view their class members" on class_members
  for select using (
    exists (select 1 from classes c where c.id = class_members.class_id and c.teacher_id = auth.uid())
  );

-- ============================================
-- FUNCTION: auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone_number)
  values (new.id, new.raw_user_meta_data->>'name', new.phone);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
