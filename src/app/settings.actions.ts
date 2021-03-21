export class SettingsAction {
  public static readonly type = '[Settings] Add item';
  constructor(public payload: string) { }
}