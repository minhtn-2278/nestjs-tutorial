import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { User } from '../users/users.entity';
import { GetEstDto } from './dtos/get-est.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstDto) {
    let query = this.repo.createQueryBuilder().select('AVG(price)', 'price')

    if (make) {
      query.where('make = :make', { make })
    }

    if (model) {
      query.andWhere('model = :model', { model })
    }

    if (lng) {
      query.andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
    }

    if (lat) {
      query.andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
    }

    if (year) {
      query.andWhere('year - :year BETWEEN -3 AND 3', { year })
    }

    if (mileage) {
      query.orderBy('ABS(mileage - :mileage)').setParameters({ mileage })
    }

    return query.limit(3).getRawMany()
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id })

    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
