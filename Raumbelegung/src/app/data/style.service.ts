/*
 *  Copyright (C) 2024 DE SIGNO GmbH
 *
 *  This program is dual licensed. If you did not license the program under
 *  different terms, the following applies:
 *
 *  This program is free software: You can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { EventEmitter, Injectable } from '@angular/core';
import { BookingViewModel } from './app-data.model';
import { TemplateInstance, TemplateService } from '@isign/forms-templates';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  style: StyleFreeModel | StyleDbModel;
  updated = new EventEmitter();
  template: TemplateInstance;

  constructor(ts: TemplateService) {
    const tmpl = (this.template = ts.getTemplate());

    const key = tmpl.key;
    if (key === 'raumbelegung2021_free' || key === 'raumbelegung_2_free') {
      const stylef: StyleFreeModel = {
        key: key,
        qr: tmpl.parameters['qr'] ?? '',
        title: tmpl.parameters['title'] ?? '',
        subtitle: tmpl.parameters['subtitle'] ?? '',
        participants: tmpl.parameters['participants']?.split(',') ?? [],
        date: tmpl.parameters['date'] ?? '',
        from: tmpl.parameters['from'] ?? '',
        to: tmpl.parameters['to'] ?? '',
      };
      this.style = stylef;
    } else if (
      key === 'raumbelegung2021A' ||
      key === 'raumbelegung2021B' ||
      key === 'raumbelegung_2_A' ||
      key === 'raumbelegung_2_B' ||
      key === 'raumbelegung_3_A' ||
      key === 'raumbelegung_3_B'
    ) {
      const styled: StyleDbModel = {
        key: key,
      };
      this.style = styled;
    } else {
      // default (empty)
      this.style = {
        key: 'raumbelegung2021A',
      };
    }
  }
}

export interface StyleModel {
  key:
    | 'raumbelegung2021_free'
    | 'raumbelegung2021A'
    | 'raumbelegung2021B'
    | 'raumbelegung_2_free'
    | 'raumbelegung_2_A'
    | 'raumbelegung_2_B'
    | 'raumbelegung_3_A'
    | 'raumbelegung_3_B';
}

export interface StyleFreeModel extends StyleModel, BookingViewModel {
  key: 'raumbelegung2021_free' | 'raumbelegung_2_free';
  qr: string;
  title: string;
  subtitle: string;
  participants: string[];
  date: string;
  from: string;
  to: string;
}

export interface StyleDbModel extends StyleModel {
  key:
    | 'raumbelegung2021A'
    | 'raumbelegung2021B'
    | 'raumbelegung_2_A'
    | 'raumbelegung_2_B'
    | 'raumbelegung_3_A'
    | 'raumbelegung_3_B';
}
