import { Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private coffeeRepository: Repository<Coffee>,
  ) {}

  async create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return await this.coffeeRepository.save(coffee);
  }

  async findAll() {
    return await this.coffeeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} coffee`;
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    await this.coffeeRepository.update(id, updateCoffeeDto);
    const updatedCoffee = await this.coffeeRepository.findOneBy({ id }); // Fetch the updated entity
    if (!updatedCoffee) {
      throw new Error(`Coffee with id ${id} not found after update.`);
    }
    return updatedCoffee;
  }

  remove(id: number) {
    return this.coffeeRepository.delete(id);
  }
}
