import React from 'react'

const ContactList = ({ contacts, currentChat, setCurrentChat }) => {
  return (
    <div className="w-1/3 border-r p-4 overflow-y-auto bg-white">
      <h2 className="text-lg font-bold mb-4">Contacts</h2>
      {contacts.map((c) => (
        <div
          key={c._id}
          onClick={() => setCurrentChat(c)}
          className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
            currentChat?._id === c._id ? "bg-gray-200" : ""
          }`}
        >
          <div className="font-semibold">{c.name}</div>
        </div>
      ))}
    </div>
  );
}
export default ContactList