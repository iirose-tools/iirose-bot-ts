export type UserState =
  | UserBotState
  | UserAwayState
  | UserEnteringState
  | UserActiveState
  | UserChattingState;

/* tslint:disable: max-classes-per-file */
export class UserBotState {}

export class UserAwayState {}

export class UserEnteringState {}

export class UserActiveState {
  constructor(public minutes: 0 | 2 | 4 | 6 | 8) {}
}

export class UserChattingState {
  constructor(public minutes: 0 | 2 | 4 | 6 | 8) {}
}
/* tslint:enable: max-classes-per-file */
