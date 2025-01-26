import { Test, TestingModule } from '@nestjs/testing';
import { SubadminService } from './subadmin.service';

describe('SubadminService', () => {
    let service: SubadminService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubadminService],
        }).compile();

        service = module.get<SubadminService>(SubadminService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
