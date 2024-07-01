// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {backend} from '../models';

export function CreateUser(arg1:string,arg2:number,arg3:string):Promise<void>;

export function GetAllUsers():Promise<Array<backend.UserGameInfo>>;

export function GetUserHighestScoreInHistory(arg1:string):Promise<number>;

export function GetUsersSortedByScore():Promise<Array<backend.UserGameInfo>>;

export function InsertOrUpdateUser(arg1:string,arg2:number,arg3:string):Promise<void>;

export function UpdateUser(arg1:string,arg2:number,arg3:string):Promise<void>;
