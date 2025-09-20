export interface Mail {
  id: number;
  subject: string;
  receiverInfos: {
    email: string;
    name: string;
  }[];
  sendAt: string;
  isSent: boolean;
}

export interface MailData extends Mail {
  isChecked?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isChecked: boolean;
}

export interface MailRecipients {
  users: Omit<User, 'id' | 'isChecked'>[];
}
