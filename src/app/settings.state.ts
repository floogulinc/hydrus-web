import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SettingsAction } from './settings.actions';

export interface ApiInfo {
  url: string;
  key: string;
}

export interface SettingsStateModel {
  apiForm: {
    model: ApiInfo,
    dirty: boolean,
    status: string,
    errors: ValidationErrors | null
  };
  settingsForm: {
    model: {
    },
    dirty: boolean,
    status: string,
    errors: ValidationErrors | null
  };
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    apiForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    },
    settingsForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {}
    }
  }
})
@Injectable()
export class SettingsState {

  @Selector()
  public static getState(state: SettingsStateModel) {
    return state;
  }

  @Selector()
  public static apiInfo(state: SettingsStateModel) {
    return state.apiForm.model;
  }

  @Selector()
  public static apiConfigured(state: SettingsStateModel) {
    return state.apiForm.status === 'VALID' && (!!state.apiForm.model.url && !!state.apiForm.model.key);
  }

  // @Action(SettingsAction)
  // public add(ctx: StateContext<SettingsStateModel>, { payload }: SettingsAction) {
  //   const stateModel = ctx.getState();
  //   stateModel.items = [...stateModel.items, payload];
  //   ctx.setState(stateModel);
  // }
}
