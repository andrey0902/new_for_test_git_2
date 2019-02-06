import { Injectable } from '@angular/core';

@Injectable()
export class RegExpService {
  public static email = /^([a-z0-9_-]+\.)*[a-z0-9_+0-9-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
  public static password = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/;
  public static slack = /^\S[\w._\-\s)(,/\[\]']{0,80}$/;
  public static userName = /^[а-яіїєёґА-ЯІЇЄҐЁ]+$/;
  public static phoneMask = ['3', '8', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public static pathPhoto = /.(jpe?g|png)$/i;
  public static uuid = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;
  //tslint:disable
  public static url = /^((?:http|ftp)s?:\/\/)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/i;
}
