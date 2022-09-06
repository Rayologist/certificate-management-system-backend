export type Text = {
  weight?: 'bold' | 'italic' | '';
  text: string;
};

export type CreateCertificatePayload = {
  activityUid: string;
  displayName: string;
  title: Text[];
  totalHour: number;
  dateString: string;
};

export type UpdateCertificatePayload = {
  id: number;
  displayName: string;
  title: Text[];
  totalHour: number;
  dateString: string;
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
  email: string;
};

export type AdminSendCertificatePayload = {
  certificateId: number;
  participantId: number;
};

export type MQSendCertficatePayload = {
  filename: string;
  displayName: string;
  participantName: string;
  email: string;
};
