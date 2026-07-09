import { Body, Controller, Get, Param, Post, Delete, Session, Patch } from '@nestjs/common';
import { HackathonService } from './hackathon.service';
import { CreateHackathonDto } from '../dto/create-hackathon.dto';
import { UpdateHackathonDto } from '../dto/update-hackathon.dto';
import { ResponseMessage } from 'src/common/decorators/response-message/response-message.decorator';
import { type UserSession, AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';

@Controller('hackathon')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) { }

  @Get('all')
  @AllowAnonymous()
  @ResponseMessage('Successfully retrieved list of hackathons.')
  getHackathons() {
    return this.hackathonService.getHackathons();
  }

  @Post()
  @Roles(['ADMIN'])
  @ResponseMessage('Hackathon successfully created.')
  createHackathon(@Session() session: UserSession, @Body() hackathonData: CreateHackathonDto) {
    return this.hackathonService.createHackathon(session.user.id, hackathonData);
  }

  @Patch('update/:id')
  @Roles(['ADMIN'])
  @ResponseMessage('Hackathon successfully updated.')
  updateHackathon(
    @Param('id') id: string,
    @Body() updateHackathonDto: UpdateHackathonDto,
  ) {
    return this.hackathonService.updateHackathon(id, updateHackathonDto);
  }

  @Delete('remove/:id')
  @Roles(['ADMIN'])
  @ResponseMessage('Hackathon successfully removed.')
  removeHackathon(@Param('id') id: string) {
    return this.hackathonService.deleteHackathon(id);
  }

  @Post('join/:id')
  @Roles(['PARTICIPANT'])
  @ResponseMessage('Successfully joined hackathon.')
  joinHackathon(@Session() session: UserSession, @Param('id') hackathonId: string) {
    return this.hackathonService.joinHackathon(hackathonId, session.user.id);
  }


  @Get(':id')
  @AllowAnonymous()
  @ResponseMessage('Successfully retrieved hackathon.')
  getHackathon(@Param('id') id: string) {
    return this.hackathonService.getHackathonById(id);
  }

}
