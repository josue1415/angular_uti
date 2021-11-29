export class Noticias {
  id: number = 0;
  createAt!: Date;
  dateExpire!: Date;
  tema: string = '';
  img_principal: string = '';
  contenido: string = '';
  expired: boolean = false;
  deleteBy: String = '';
}
