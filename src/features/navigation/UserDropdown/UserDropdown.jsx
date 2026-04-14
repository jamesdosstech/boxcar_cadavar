import { useState } from "react";

const UserDropdown = ({updateUserName}) => {
    const [newDisplayName, setNewDisplayName] = useState("");
  
    const handleUpdateUserName = async (e) => {
      e.preventDefault();
      try {
        await updateUserName(newDisplayName);
        setNewDisplayName("");
        alert("Username updated successfully!");
      } catch (error) {
        console.error("Error updating username:", error.message);
      }
    };
  
    return (
      <div className="user-dropdown">
        <form onSubmit={handleUpdateUserName}>
          <input
            type="text"
            placeholder="New Display Name"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            required
          />
          <button type="submit">Update Username</button>
        </form>
      </div>
    );
  };

  export default UserDropdown
  