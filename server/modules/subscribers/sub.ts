import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import {BaseEntity} from 'src/entity/BaseEntity'
import {plainToClass} from 'class-transformer';

@EventSubscriber()
export class PersonSubscriber implements EntitySubscriberInterface<BaseEntity> {
  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>):any {
    // const res = plainToClass(BaseEntity, event.entity);
    // console.log('createdAt' in  res);
    // .apply(this, plainToClass(BaseEntity, event.entity));
    // return ;
  }
}
