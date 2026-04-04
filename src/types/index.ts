export interface PastPerformance {
  year: number;
  votes: number;
  result: "Won" | "Lost";
}

export interface RecentElectionCandidate {
  name: string;
  party: string;
  votes: number;
  vote_percentage: number;
}

export interface RecentElection {
  year: number;
  type: string;
  winner: RecentElectionCandidate;
  runner_up: RecentElectionCandidate;
  margin_votes: number;
  margin_percentage: number;
}

export interface WorkItem {
  year: number;
  category: "Infrastructure" | "Welfare" | "Development";
  title: string;
  detail: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  education: string;
  address: string;
  age:number;
  image:string;
  criminal_cases: number;
  assets: string;
  achievements: string[];
  past_performance: PastPerformance[];
  work_timeline: WorkItem[];
  strengths: string[];
  weaknesses: string[];
  public_perception_score: number;
}

export interface Constituency {
  id: string;
  name: string;
  district: string;
  "ASSEMBLY NO": number;
  "Poliing Booths": number;
  Voters: string;
  "geographical area": string;
  local_bodies: {
    name: string;
    type: string;
  }[];
  issues: {
    issue: string;
    source: string;
  }[];
}

export interface ConstituencyOverview {
  period: string;
  overview: string;
  representatives: {
    name: string;
    tenure: string;
  }[];
  key_developments: {
    category: string;
    title: string;
    description: string;
  }[];
  political_insights: {
    dominant_alliance: string;
    trend: string;
    details: string[];
  };
}

export interface ElectionHistoryItem {
  year: number;
  winner: string;
  party: string;
}

export interface ElectionData {
  constituency: Constituency;
  election_date: string;
  candidates: Candidate[];
  electionHistory?: ElectionHistoryItem[];
  recent_elections?: RecentElection[];
  constituency_overview?: ConstituencyOverview;
}
