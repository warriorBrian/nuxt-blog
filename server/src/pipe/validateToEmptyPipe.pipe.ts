import {Injectable, ArgumentMetadata, PipeTransform, BadRequestException} from '@nestjs/common';
import {MESSAGES} from 'src/core/enums/message.enum';
const difference = (a, b) => {
  const s = new Set(b);
  return a.filter(x => !s.has(x));
};
@Injectable()
export class ValidateToEmptyPipe implements PipeTransform {
  public validateParams: any[];
  constructor(params = []) {
    if (!params) {
      throw new BadRequestException(MESSAGES.VALIDATE_PARAMS_ERROR);
    }
    this.validateParams = params;
  }
  transform(value: any, metadata: ArgumentMetadata) {
    const diff = difference(this.validateParams, Object.keys(value));
    if (diff.length) {
      throw new BadRequestException(`缺少必要参数: ${diff.toString()}`)
    }
    return value;
  }
}
