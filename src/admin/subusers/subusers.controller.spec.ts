import { Test, TestingModule } from '@nestjs/testing';
import { SubusersController } from './subusers.controller';
import { SubusersService } from './subusers.service';

describe('SubusersController', () => {
    let controller: SubusersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubusersController],
            providers: [SubusersService],
        }).compile();

        controller = module.get<SubusersController>(SubusersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
