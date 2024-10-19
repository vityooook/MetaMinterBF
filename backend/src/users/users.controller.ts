import { Controller, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update')
  async update(@CurrentUser() user: User, @Body() updateData: Partial<User>) {
    return this.usersService.update(user._id, updateData);
  }

  @Patch('onboarding/complete')
  async completeOnboarding(@CurrentUser() user: User) {
    return this.usersService.completeOnboarding(user._id);
  }

  @Patch('wallet-address')
  async addWalletAddress(@CurrentUser() user: User, @Body() body: { walletAddress: string }) {
    return this.usersService.addWalletAddress(user._id, body.walletAddress);
  }
}
