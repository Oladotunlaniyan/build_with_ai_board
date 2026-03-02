export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export type Project = {
  id: string;
  title: string;
  student: {
    id: string;
    nickname: string;
  };
  screenshotUrl: string;
  screenshotHint: string;
  shortDescription: string;
  fullDescription: string;
  liveUrl: string;
  githubUrl: string;
  aiTool: string;
  techStack: string[];
  batch: string;
  status: ProjectStatus;
  createdAt: Date;
};

export type User = {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'admin';
};
