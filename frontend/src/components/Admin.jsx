import React, { useEffect, useState } from 'react'
import { getAllTickets } from '../services/techSupportService';
import { getUserByRole } from '../services/userService';
import { assignTechSupport, closeTicketStatus } from '../services/adminService';
import { toast } from 'react-toastify';

export default function Admin() {
    const[data,setData]= useState([]);
    const [buttonStates, setButtonStates] = useState({});
    const [selectedRole, setSelectedRole] = useState('');
    const [supportRoles, setSupportRoles] = useState([]);

    
  useEffect(() => {
    
        const fetchData = async () => {
            try {
                const response = await getAllTickets();
                setData(response);
                const initialButtonStates = response.reduce((acc, item) => {
                    acc[item.ticketId] = false;
                    return acc;
                }, {});
                setButtonStates(initialButtonStates);
            } catch (error) {
                console.log(error);
            }

            const fetchedSupportRoles = await getUserByRole('support');
            setSupportRoles(fetchedSupportRoles);
        };

        fetchData();
    }, []);


    const handleButtonClick = (ticketId) => {
        const newButtonStates = { ...buttonStates };
        newButtonStates[ticketId] = true;
        setButtonStates(newButtonStates);
    };

    const handleAssignSupport = (ticketId) => {
        // Handle assigning support to ticketId here
        // For simplicity, let's log the selected role and ticketId
        const assign = async () => {
            const response =  await assignTechSupport(ticketId,selectedRole);
            console.log(response);
        }
        assign();
        const newButtonStates = { ...buttonStates };
        newButtonStates[ticketId] = false;
        setButtonStates(newButtonStates);
        console.log("Assigning support role:", selectedRole, "to ticketId:", ticketId);
    };

    const handleDropdownChange = (e) => {
        setSelectedRole(e.target.value);
    };
    

    const changeTicketStatus = (ticketId,event) => {
   
        console.log(ticketId);
        closeTicketStatus(ticketId)
            .then((res) => {
                toast.success("Ticket Closed Succufully.")
                console.log(res);
                const newStatus = res;
                
                setData(prevData => prevData.map(item => {
                    if (item.ticketId === ticketId) {
                        return { ...item, status: newStatus };
                    } else {
                        return item;
                    }
                }));
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error changing ticket status:', error);
                toast.error("An error occurred while changing ticket status: " + error);
            });
   };

   return (
    <div className="space-y-4">
        <h1 className='m-10 text-center font-extrabold'>Admin Page</h1>
        {data.map((item) => (
            <div key={item.ticketId} className="border border-gray-200 p-4 rounded-md">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">{item.ticketname}
                        <div className="text-sm my-5 font-light ">{item.description}</div>
                        <div className="text-sm my-5 font-bold bg-blue-600 text-white px-2 py-1 rounded"><h1>created By</h1>{item.createdBy}</div>
                    </div>

                    <div>
                        {!buttonStates[item.ticketId] && (
                            <button
                                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-[50px] rounded"
                                onClick={() => handleButtonClick(item.ticketId)}
                            >
                                Assign Tech Support
                            </button>
                        )}
                        {buttonStates[item.ticketId] && (
                            <div>
                                <select value={selectedRole} onChange={handleDropdownChange}>
                                    <option value="">Select Support Role</option>
                                    {supportRoles.map((role, index) => (
                                        <option key={index} value={role.userId}>{role.firstname}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleAssignSupport(item.ticketId)}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Assign
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            className={`flex w-20 justify-center rounded-md bg-red-600 px-1 py-1.5 my-5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                            onClick={(e) => changeTicketStatus(item.ticketId,e)}
                            style={item.status === 'close' ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                            disabled={item.status === 'close'}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

};
