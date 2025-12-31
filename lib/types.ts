export type Role = 'Backend Engineer' | 'Frontend Engineer' | 'Fullstack Engineer' | 'Systems Engineer' | 'Data Engineer' | 'DevOps Engineer' | 'Security Engineer';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type DrillType = 'spot_assumptions' | 'rank_failures' | 'predict_scaling' | 'choose_tradeoffs';

export interface User {
    id: string;
    email: string;
    full_name: string;
    selected_role: Role | null;
    created_at: string;
    last_login: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    role: Role;
    difficulty: Difficulty;
    estimated_time_minutes: number;
    scenario: string;
    prompts: string[];
    created_at: string;
}

export interface ResponseScore {
    clarity: number;
    constraints_awareness: number;
    trade_off_reasoning: number;
    failure_anticipation: number;
    simplicity: number;
}

export interface TaskResponse {
    id: string;
    user_id: string;
    task_id: string;
    assumptions: string;
    architecture: string;
    trade_offs: string;
    failure_scenarios: string;
    submitted_at: string;
    score: number;
    score_breakdown: ResponseScore;
    ai_feedback?: string;
    ai_unlocked_at?: string;
}

export interface Drill {
    id: string;
    title: string;
    drill_type: DrillType;
    question: string;
    options: string[];
    correct_answer?: string;
    explanation?: string;
    created_at: string;
}

export interface ProgressStats {
    user_id: string;
    total_tasks_completed: number;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string;
    total_score: number;
    average_score: number;
}
