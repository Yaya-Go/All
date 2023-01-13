export interface GiftGame {
  id?: string;
  name: string;
  people: GiftPeople[];
  started: boolean;
}

export interface GiftPeople {
  name: string;
  sendTo: string;
}
