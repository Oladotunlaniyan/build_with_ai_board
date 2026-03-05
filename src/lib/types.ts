export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export type Project = {
  id: string;
  title: string;
  userId: string;
  userNickname: string;
  screenshotUrl: string;
  shortDescription: string;
  fullDescription: string;
  liveUrl: string;
  githubUrl: string;
  techStack: string[];
  batch: string;
  status: ProjectStatus;
  createdAt: Date;
};

export type UserProfile = {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'admin';
};
