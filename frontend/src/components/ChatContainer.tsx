import React, { useEffect, useRef } from 'react'
import { useMessageStore } from '../store/UseMessage'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../libs/utlis';

const ChatContainer = () => {
  const { messages, getMessages, selectedUser, isMessagesLoading , subcribeTomessage , unsubcribeTomessage  } = useMessageStore();
  const { authUser } = useAuthStore();
  const messageendref = useRef<any>(null);

  console.log(authUser)
  console.log(messages)

  useEffect(() => {
      getMessages(selectedUser);
      subcribeTomessage();
    return () => unsubcribeTomessage()
  }, [selectedUser._id, getMessages , subcribeTomessage , unsubcribeTomessage]);

  useEffect(() => {
      if (messageendref.current && messages) {
        messageendref.current.scrollIntoView({behavior : "smooth"})
      }
  },[messages])

  // flex-1 flex flex-col overflow-auto
  if (isMessagesLoading) {
    return (
      <>
        <div className=' flex-1 flex flex-col overflow-auto'>
          <ChatHeader />
          <MessageSkeleton />
          <MessageInput />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        {
          messages.length > 0 ? (
            <>
              <div  className="flex-1 overflow-y-auto p-4 space-y-4">
                {
                  messages.map((message) => (
                    <>
                      <div
                        key={message._id}
                        className={`chat ${message?.senderId === authUser.message._id ? "chat-end" : "chat-start"}`}
                        ref={messageendref}
                      >
                        <div className='chat-image avatar'>
                          <div className='size-10 rounded-full border'>
                            <img src={message.senderId === authUser.message._id ? authUser.message.profilePic || '/avatar.png' : selectedUser?.profilePic || '/avatar.png'} alt="profile-pic" />
                          </div>

                        </div>

                        <div className='chat-header mb-1'>
                          <time className='text-xs opacity-50 ml-1'>{formatMessageTime(message?.createdAt)}</time>
                        </div>


                        <div className="chat-bubble flex flex-col">
                          {message.image && (
                            <img
                              src={message.image}
                              alt="Attachment"
                              className="sm:max-w-[200px] rounded-md mb-2"
                            />
                          )}
                          {message.text && <p>{message.text}</p>}
                        </div>

                      </div>
                    </>
                  ))
                }
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            </>
          )
        }
        <MessageInput />
      </div>
    </>
  )
}

export default ChatContainer
