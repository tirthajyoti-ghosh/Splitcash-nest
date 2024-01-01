import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import ActivityFeedSchema from './activity-feed.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ActivityFeedService {
  @WebSocketServer() server;
  constructor(
    @InjectModel(ActivityFeedSchema.name)
    private activityModel: Model<typeof ActivityFeedSchema>,
  ) {}
  createActivity(createActivityDto) {
    const newActivity = new this.activityModel(createActivityDto);
    newActivity.save();
    this.server.emit(createActivityDto['group'], createActivityDto);
  }

  findByGroup(groupId, pageNo, size) {
    const skip = (pageNo - 1) * size; // Calculate the number of documents to skip
    return this.activityModel
      .find({ group: groupId }) // Find activities by groupId
      .skip(skip) // Skip the documents for previous pages
      .limit(size) // Limit the number of documents to the size
      .populate('creator') // Populate the 'creator' field from the 'User' collection
      .populate('group') // Populate the 'group' field from the 'Group' collection
      .populate({
        path: 'relatedId',
        model: 'onModel', // Dynamically populate based on the 'onModel' field
      })
      .exec(); // Execute the query
  }

  findAll() {
    return `This action returns all activityFeed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activityFeed`;
  }

  update(id: number, updateActivityFeedDto) {
    return `This action updates a #${id} activityFeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityFeed`;
  }
}
