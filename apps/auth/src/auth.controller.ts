import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';

@Controller()
export class AuthController {
    @MessagePattern('auth_validate')
    handleValidate() {
        return {valid: true};
    }
}
