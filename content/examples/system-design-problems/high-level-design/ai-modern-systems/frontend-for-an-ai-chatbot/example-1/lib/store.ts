function createConversationStore() {
  const messages = [];
  let activeStream = null;

  return {
    getMessages() {
      return messages.map((message) => ({ ...message }));
    },

    addUserMessage(content) {
      const message = {
        id: `user_${messages.length + 1}`,
        role: 'user',
        content,
        status: 'complete',
      };
      messages.push(message);
      return message;
    },

    startAssistantMessage(streamId) {
      if (activeStream) {
        const previous = messages.find((message) => message.id === activeStream.messageId);
        if (previous?.status === 'streaming') {
          previous.content += activeStream.buffer;
          activeStream.buffer = '';
          previous.status = 'aborted';
        }
      }

      const message = {
        id: `assistant_${messages.length + 1}`,
        role: 'assistant',
        content: '',
        status: 'streaming',
      };
      messages.push(message);
      activeStream = { streamId, messageId: message.id, buffer: '' };
      return message;
    },

    appendToken(streamId, token) {
      if (!activeStream || activeStream.streamId !== streamId) return false;
      activeStream.buffer += token;
      return true;
    },

    flush(streamId) {
      if (!activeStream || activeStream.streamId !== streamId) return false;
      const message = messages.find((item) => item.id === activeStream.messageId);
      if (!message) return false;
      message.content += activeStream.buffer;
      activeStream.buffer = '';
      return true;
    },

    complete(streamId) {
      if (!this.flush(streamId)) return false;
      const message = messages.find((item) => item.id === activeStream.messageId);
      if (!message) return false;
      message.status = 'complete';
      activeStream = null;
      return true;
    },

    abort(streamId) {
      if (!activeStream || activeStream.streamId !== streamId) return false;
      this.flush(streamId);
      const message = messages.find((item) => item.id === activeStream.messageId);
      if (message) message.status = 'aborted';
      activeStream = null;
      return true;
    },
  };
}

module.exports = { createConversationStore };
