const Room = require("../models/room.model");
const NotificationService = require("./notification.service");

class RoomService {
  // Join a room
  async joinRoom(roomId, userId) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    console.log("[joinRoom]", {
      now: new Date(),
      endTime: room.endTime,
      roomId: room._id.toString(),
      status: room.status,
    });

    if (room.status === "Closed") {
      throw new Error("Room is closed");
    }

    // Check if user is already a participant
    if (room.participants.includes(userId)) {
      throw new Error("User is already a participant");
    }

    // Check max participants
    if (room.participants.length >= room.maxParticipants) {
      throw new Error("Room has reached maximum participants");
    }

    // Check private room invitation
    if (room.type === "private" && !room.invitedUsers.includes(userId)) {
      throw new Error("User is not invited to this private room");
    }

    // Add user to participants
    room.participants.push(userId);
    await room.save();

    // Notify host (optional)
    if (room.host.toString() !== userId) {
      await NotificationService.createNotification({
        userId: room.host,
        message: `A new user joined your room: ${room.title}`,
        type: "ParticipantJoined",
        roomId,
      });
    }

    // Populate host, participants, and invitedUsers for response
    return await Room.findById(roomId)
      .populate("host", "username email")
      .populate("participants", "username email")
      .populate("invitedUsers", "username email");
  }

  // Leave a room
  async leaveRoom(roomId, userId) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Check if user is a participant
    if (!room.participants.includes(userId)) {
      throw new Error("User is not a participant in this room");
    }

    // Prevent host from leaving
    if (room.host.toString() === userId) {
      throw new Error("Host cannot leave the room");
    }

    // Remove user from participants
    room.participants = room.participants.filter(
      (id) => id.toString() !== userId
    );
    await room.save();

    // Populate host, participants, and invitedUsers for response
    return await Room.findById(roomId)
      .populate("host", "username email")
      .populate("participants", "username email")
      .populate("invitedUsers", "username email");
  }

  // Invite users to a private room
  async inviteToRoom(roomId, userId, invitedUserIds) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    // Only host can invite
    if (room.host.toString() !== userId) {
      throw new Error("Only the host can invite users");
    }

    // Check if room is private
    if (room.type !== "private") {
      throw new Error("Invitations are only for private rooms");
    }

    // Add invited users (avoid duplicates)
    invitedUserIds.forEach((id) => {
      if (!room.invitedUsers.includes(id)) {
        room.invitedUsers.push(id);
      }
    });

    await room.save();

    // Notify invited users
    for (const invitedUserId of invitedUserIds) {
      await NotificationService.createNotification({
        userId: invitedUserId,
        message: `You were invited to join the private room: ${room.title}`,
        type: "Invitation",
        roomId,
      });
    }

    return await Room.findById(roomId)
      .populate("host", "username email")
      .populate("participants", "username email")
      .populate("invitedUsers", "username email");
  }

  // Update status for all rooms
  async updateRoomStatuses() {
    const now = new Date();
    const rooms = await Room.find();

    let updatedCount = 0;
    let deletedCount = 0;

    for (const room of rooms) {
      // Check for invalid room data
      if (!room.host || !room.startTime || !room.endTime) {
        console.warn(
          `Deleting invalid room ${room._id} due to missing required fields.`
        );
        try {
          await Room.findByIdAndDelete(room._id);
          deletedCount++;
        } catch (err) {
          console.error(
            `Failed to delete invalid room ${room._id}: ${err.message}`
          );
        }
        continue;
      }

      let newStatus = room.status;
      if (now < room.startTime) {
        newStatus = "Scheduled";
      } else if (now >= room.startTime && now <= room.endTime) {
        newStatus = "Live";
      } else if (now > room.endTime) {
        newStatus = "Closed";
      }

      if (newStatus !== room.status) {
        room.status = newStatus;
        try {
          await room.save();
          updatedCount++;

          // Notify participants and host of status change
          const userIds = [...room.participants, room.host];
          for (const userId of userIds) {
            await NotificationService.createNotification({
              userId,
              message: `Room "${room.title}" is now ${newStatus}`,
              type: "StatusChange",
              roomId: room._id,
            });
          }
        } catch (error) {
          console.error(`Error saving room ${room._id}: ${error.message}`);
        }
      }
    }

    console.info(
      `Room statuses updated: ${updatedCount}, invalid rooms deleted: ${deletedCount}`
    );
    return { updatedCount, deletedCount };
  }
}

module.exports = new RoomService();
