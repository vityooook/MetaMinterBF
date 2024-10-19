import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InitData } from '../auth/auth.utils';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async addTransaction(user, amount, questId = null, type = 'quest_complete') {
    const newTransaction = new this.transactionModel({
      user: user._id,
      questId,
      amount,
      type,
    });
    return await newTransaction.save();
  }

  findOneById(id: any) {
    return this.userModel.findOne({ _id: id }).populate([
      {
        path: 'referrals',
        select: '_id firstName lastName username walletAddress',
      },
    ]).exec();
  }

  findOne(params: any) {
    return this.userModel.findOne(params).exec();
  }

  find(params: any, params2 = null) {
    return this.userModel.find(params, params2).exec();
  }

  async findUsersByTelegramChat(chatId: string): Promise<User[]> {
    return await this.userModel.find({
      telegram_chats: { $elemMatch: { id: Number(chatId) } },
    });
  }

  async findOrCreateTelegramUser(initData: InitData) {
    let user = await this.userModel.findOne({ id: initData.user.id }).populate([
      {
        path: 'referrals',
        select: '_id firstName lastName username walletAddress',
      },
      {
        path: 'referrer',
        select: '_id firstName lastName username walletAddress',
      },
    ]).exec();
    if (user) {
      return user;
    }

    const newUser = new this.userModel({
      id: initData.user.id,
      firstName: initData.user.first_name,
      lastName: initData.user.last_name,
      username: initData.user.username,
      languageCode: initData.user.language_code,
    });
    user = await newUser.save();
    return this.userModel.findById(user._id).exec();
  }

  async update(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
  }

  async getUserProfile(id: string) {
    try {
      const user = await this.userModel.findOne({ id: id }).exec();
      if (!user) throw new UnauthorizedException();
      return user;
    } catch (e) {
      console.error(e);
    }
  }

  async completeOnboarding(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new UnauthorizedException();
    if (user.isOnboarded) {
      throw new ForbiddenException('User is already onboarded');
    }

    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          isOnboarded: true,
        },
        { new: true },
      )
      .exec();
  }

  async addWalletAddress(userId: string, walletAddress: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { walletAddress } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return updatedUser;
  }

  async addAmbasador(userId: string) {
    try {
      await this.userModel.updateOne(
        { _id: userId },
        {
          $set: { isAmbasador: true },
        },
      );
    } catch (error) {}
  }

  async addReferral(referrerId: string, referralId: string) {
    try {
      const referrer = await this.userModel.findOne({ id: referrerId }).exec();
      if (!referrer) throw new NotFoundException();

      const referral = await this.userModel
        .findOne({
          _id: referralId,
          referrer: null,
          createdAt: {
            $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          },
        })
        .exec();

      if (!referral) throw new NotFoundException();

      if (referrer.id == referral.id) throw new NotFoundException();

      console.log(referrer)

      if (!referrer.referrals) {
        referrer.referrals = [referralId];
      } else {
        referrer.referrals.push(referralId);
      }

      await this.userModel.updateOne(
        { _id: referrer._id },
        {
          $set: { referrals: referrer.referrals },
        },
      );

      await this.userModel.updateOne(
        { _id: referralId },
        {
          $set: { referrer: referrer._id },
        },
      );

      return await this.userModel.findOne({ _id: referrer._id }).exec();
    } catch (error) {
      throw error;
    }
  }
}
