export type Text = {
  weight?: 'bold' | 'italic' | '';
  text: string;
};

export type CreateCertificatePayload = {
  templateId: number;
  activityUid: string;
  displayName: string;
  content: Text[];
};

export type UpdateCertificatePayload = {
  id: number;
  displayName: string;
  content: Text[];
};

export type CreateParticipantPayload = {
  activityUid: string;
  name: string;
  from: string;
  title: string;
  email: string;
  phone: string;
};

export type UpdateParticipantPayload = {
  id: number;
  name: string;
  from: string;
  title: string;
  email: string;
  phone: string;
};

export type SendCertificatePayload = {
  activityUid: string;
  certificateId: number;
  name: string;
  altName: string;
  email: string;
};

export type AdminSendCertificatePayload = {
  altName: string;
  certificateId: number;
  participantId: number;
};

export type MQSendCertificatePayload = {
  userEmail: string;
  certificateId: number;
  participantName: string;
};

export type MQAdminSendCertificatePayload = {
  participantId: string;
  certificateId: number;
};
