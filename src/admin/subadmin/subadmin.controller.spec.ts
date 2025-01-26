import { Test, TestingModule } from '@nestjs/testing';
import { SubadminController } from './subadmin.controller';
import { SubadminService } from './subadmin.service';

describe('SubadminController', () => {
    let controller: SubadminController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubadminController],
            providers: [SubadminService],
        }).compile();

        controller = module.get<SubadminController>(SubadminController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
