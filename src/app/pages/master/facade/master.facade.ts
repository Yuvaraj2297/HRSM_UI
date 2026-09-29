import {
  Injectable,
  inject
} from '@angular/core';

import { Observable } from 'rxjs';

import {
  MasterType
} from './master-form.facade';
import { RemoteService } from '../../../services/remote.service';


@Injectable({
  providedIn: 'root'
})
export class MasterFacade {

  private remoteService = inject(RemoteService);


  // =========================================================
  // API URLS
  // =========================================================

  private urls = {

    // Department
    departmentList: '/api/master/department/list',
    departmentCreate: '/api/master/department/create',
    departmentUpdate: '/api/master/department/update',
    departmentDelete: '/api/master/department/delete',

    // Team
    teamList: '/api/master/team/list',
    teamCreate: '/api/master/team/create',
    teamUpdate: '/api/master/team/update',
    teamDelete: '/api/master/team/delete',

    // Position
    positionList: '/api/master/position/list',
    positionCreate: '/api/master/position/create',
    positionUpdate: '/api/master/position/update',
    positionDelete: '/api/master/position/delete',

    // Document
    documentList: '/api/master/document/list',
    documentCreate: '/api/master/document/create',
    documentUpdate: '/api/master/document/update',
    documentDelete: '/api/master/document/delete',

    // Work Location
    workList: '/api/master/work-location/list',
    workCreate: '/api/master/work-location/create',
    workUpdate: '/api/master/work-location/update',
    workDelete: '/api/master/work-location/delete',

    // State
    stateList: '/api/master/state/list',
    stateCreate: '/api/master/state/create',
    stateUpdate: '/api/master/state/update',
    stateDelete: '/api/master/state/delete',

    // District
    districtList: '/api/master/district/list',
    districtCreate: '/api/master/district/create',
    districtUpdate: '/api/master/district/update',
    districtDelete: '/api/master/district/delete',

    // Leave Type
    leaveList: '/api/master/leave-type/list',
    leaveCreate: '/api/master/leave-type/create',
    leaveUpdate: '/api/master/leave-type/update',
    leaveDelete: '/api/master/leave-type/delete',

    // Shift
    shiftList: '/api/master/shift/list',
    shiftCreate: '/api/master/shift/create',
    shiftUpdate: '/api/master/shift/update',
    shiftDelete: '/api/master/shift/delete'

  };


  // =========================================================
  // GET LIST
  // =========================================================

  getList(
    type: MasterType
  ): Observable<any> {

    const url = this.getUrl(type, 'list');

    return this.remoteService.sendRequest(
      'GET',
      url
    );
  }


  // =========================================================
  // CREATE
  // =========================================================

  create(
    type: MasterType,
    data: any
  ): Observable<any> {

    const url = this.getUrl(type, 'create');

    return this.remoteService.sendRequest(
      'POST',
      url,
      data
    );
  }


  // =========================================================
  // UPDATE
  // =========================================================

  update(
    type: MasterType,
    data: any
  ): Observable<any> {

    const url = this.getUrl(type, 'update');

    return this.remoteService.sendRequest(
      'POST',
      url,
      data
    );
  }


  // =========================================================
  // DELETE
  // =========================================================

  delete(
    type: MasterType,
    id: number
  ): Observable<any> {

    const url = this.getUrl(type, 'delete');

    return this.remoteService.sendRequest(
      'POST',
      url,
      {
        id: id
      }
    );
  }


  // =========================================================
  // GET URL
  // =========================================================

private getUrl(
    type: MasterType,
    action:
      | 'list'
      | 'create'
      | 'update'
      | 'delete'
  ): string {

    const prefixMap: Record<MasterType, string> = {

      department: 'department',

      job_type:'job_type',

      designation:'designation',

      branch:'branch',

      employee:'employee',

      work: 'work',

      country:'country',

      state: 'state',

      district: 'district',

      leave: 'leave',

      shift: 'shift',

      relieving_type:'relieving',

      notice_period:'notice-period',

      holiday:'holiday',

      permission:'permission',

      role:'role'

    };

    const prefix = prefixMap[type];

    const key =
      `${prefix}${this.capitalize(action)}` as keyof typeof this.urls;

    return this.urls[key];
  }

  // =========================================================
  // CAPITALIZE
  // =========================================================

  private capitalize(
    value: string
  ): string {

    return value.charAt(0).toUpperCase()
      + value.slice(1);
  }

}