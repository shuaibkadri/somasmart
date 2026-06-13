-- ============================================
-- SEED DATA: Physics, Form 4 — sample question bank
-- ============================================

-- Subject
insert into subjects (id, name) values
  ('a0000000-0000-0000-0000-000000000001', 'Physics');

-- Topics
insert into topics (id, subject_id, name) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mechanics'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Electricity');

-- Subtopics
insert into subtopics (id, topic_id, name) values
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Forces & Newton''s Laws'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Kinematics'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Electric Circuits');

-- ============================================
-- QUESTIONS: Forces & Newton's Laws (Core - NECTA style)
-- ============================================
insert into questions (subtopic_id, question_type, tier, source_syllabus, question_text, options, correct_answer, explanation, year, difficulty) values
('c0000000-0000-0000-0000-000000000001', 'mcq', 'core', 'NECTA',
 'A force of 20 N acts on a body of mass 4 kg. What is the acceleration of the body?',
 '{"A": "0.2 m/s²", "B": "5 m/s²", "C": "16 m/s²", "D": "80 m/s²"}', 'B',
 'Using F = ma, a = F/m = 20/4 = 5 m/s².', 2022, 'easy'),

('c0000000-0000-0000-0000-000000000001', 'mcq', 'core', 'NECTA',
 'Which of Newton''s laws states that for every action there is an equal and opposite reaction?',
 '{"A": "First law", "B": "Second law", "C": "Third law", "D": "Law of gravitation"}', 'C',
 'Newton''s Third Law describes action-reaction pairs of forces.', 2021, 'easy'),

('c0000000-0000-0000-0000-000000000001', 'mcq', 'core', 'NECTA',
 'A body remains at rest or in uniform motion unless acted upon by a resultant force. This is a statement of:',
 '{"A": "Newton''s First Law", "B": "Newton''s Second Law", "C": "Newton''s Third Law", "D": "Hooke''s Law"}', 'A',
 'This is the law of inertia — Newton''s First Law.', 2020, 'easy'),

('c0000000-0000-0000-0000-000000000001', 'mcq', 'core', 'NECTA',
 'A box of mass 10 kg is pulled with a force of 50 N across a rough floor. If friction opposes the motion with a force of 30 N, find the acceleration of the box.',
 '{"A": "2 m/s²", "B": "3 m/s²", "C": "5 m/s²", "D": "8 m/s²"}', 'A',
 'Resultant force = 50 - 30 = 20 N. a = F/m = 20/10 = 2 m/s².', 2023, 'medium'),

-- ============================================
-- QUESTIONS: Forces & Newton's Laws (Challenge - KCSE/cross-syllabus style)
-- ============================================
('c0000000-0000-0000-0000-000000000001', 'mcq', 'challenge', 'KCSE',
 'Two forces of 8 N and 6 N act at right angles to each other on an object. What is the magnitude of the resultant force?',
 '{"A": "2 N", "B": "10 N", "C": "14 N", "D": "48 N"}', 'B',
 'Using Pythagoras: resultant = √(8² + 6²) = √(64+36) = √100 = 10 N.', 2021, 'medium'),

('c0000000-0000-0000-0000-000000000001', 'mcq', 'challenge', 'IGCSE',
 'A 2 kg object resting on a table experiences a normal reaction force. If a 5 N downward force is added on top of the object, what happens to the normal reaction force (take g = 10 m/s²)?',
 '{"A": "It decreases to 15 N", "B": "It stays at 20 N", "C": "It increases to 25 N", "D": "It becomes zero"}', 'C',
 'Normal reaction balances total downward force: weight (20 N) + added force (5 N) = 25 N.', 2022, 'hard'),

-- ============================================
-- QUESTIONS: Kinematics (Core)
-- ============================================
('c0000000-0000-0000-0000-000000000002', 'mcq', 'core', 'NECTA',
 'A car starts from rest and accelerates uniformly to a speed of 20 m/s in 5 seconds. What is its acceleration?',
 '{"A": "2 m/s²", "B": "4 m/s²", "C": "5 m/s²", "D": "100 m/s²"}', 'B',
 'a = (v - u)/t = (20 - 0)/5 = 4 m/s².', 2022, 'easy'),

('c0000000-0000-0000-0000-000000000002', 'mcq', 'core', 'NECTA',
 'A body moving with a velocity of 10 m/s decelerates uniformly at 2 m/s². How long does it take to stop?',
 '{"A": "2 s", "B": "5 s", "C": "8 s", "D": "20 s"}', 'B',
 'Time = velocity / deceleration = 10/2 = 5 s.', 2021, 'medium'),

-- ============================================
-- QUESTIONS: Kinematics (Challenge)
-- ============================================
('c0000000-0000-0000-0000-000000000002', 'mcq', 'challenge', 'KCSE',
 'A ball is thrown vertically upward with a velocity of 30 m/s. Taking g = 10 m/s², how long does it take to reach its maximum height?',
 '{"A": "1 s", "B": "3 s", "C": "6 s", "D": "30 s"}', 'B',
 'At maximum height, v = 0. t = u/g = 30/10 = 3 s.', 2020, 'medium'),

-- ============================================
-- QUESTIONS: Electric Circuits (Core)
-- ============================================
('c0000000-0000-0000-0000-000000000003', 'mcq', 'core', 'NECTA',
 'Three resistors of 2 Ω, 3 Ω, and 5 Ω are connected in series. What is their total resistance?',
 '{"A": "0.97 Ω", "B": "10 Ω", "C": "30 Ω", "D": "1.03 Ω"}', 'B',
 'In series, resistances simply add: 2 + 3 + 5 = 10 Ω.', 2022, 'easy'),

('c0000000-0000-0000-0000-000000000003', 'mcq', 'core', 'NECTA',
 'A current of 2 A flows through a resistor of 5 Ω. What is the voltage across the resistor?',
 '{"A": "2.5 V", "B": "7 V", "C": "10 V", "D": "0.4 V"}', 'C',
 'Using V = IR, V = 2 × 5 = 10 V.', 2023, 'easy'),

-- ============================================
-- QUESTIONS: Electric Circuits (Challenge)
-- ============================================
('c0000000-0000-0000-0000-000000000003', 'mcq', 'challenge', 'KCSE',
 'Two resistors of 4 Ω and 6 Ω are connected in parallel. What is the combined resistance?',
 '{"A": "2.4 Ω", "B": "10 Ω", "C": "24 Ω", "D": "1.5 Ω"}', 'A',
 '1/R = 1/4 + 1/6 = 5/12, so R = 12/5 = 2.4 Ω. Parallel resistance is always less than the smallest individual resistor.', 2021, 'hard');
