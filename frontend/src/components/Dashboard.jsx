import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authprovider';
import { changeStatus, getTicketByEmail, raiseTicket } from '../services/userService';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const [state, setState] = useState(false); // Set to false to initially hide the form
    const [show, setShow] = useState(true); // Set to true to initially show the ticket list
    const [selectedStatus, setSelectedStatus] = useState({});
    const [buttonState, setButtonState] = useState(true);
    const navigation = useNavigate();
    const [data, setData] = useState([]);
    const [ticketname, setTicketName] = useState('');
    const [description, setDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [record,setRecord] = useState('');
    const [ticketStatus,setTicketStatus] = useState('');

    useEffect(()=>{
        console.log("did mount")
        console.log(user);
        if(true){
            fetchData();
        }
    },[]);

    useEffect(() => {
        if(true){
            fetchData();
        }
    },[state])

    useEffect(() => {
        if (user) {
            setCreatedBy(user.email);
            fetchData();
        }
    }, [user, createdBy]);

    useEffect(()=>{
        if (user) {
            fetchData()
        }
    },[record]);

    const fetchData = async () => {
        try {
            console.log(createdBy);
            const response = await getTicketByEmail(createdBy);
            setData(response || []);
        } catch (error) {
            toast.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setButtonState(true);
    
        
        const newTicket = {
            ticketname,
            description,
            createdBy,
        };

        raiseTicket(newTicket)
            .then((res) => {
                console.log(res.data);
                toast.success("Ticket Raised Successful..!! ")
                // navigation("/dashboard");
                setShow(true);
                setState(false);
            })
            .catch((e) => {
                console.log(e);
                toast.error("An error occurred while submitting." + e);
            });

        setTicketName('');
        setDescription('');
        setRecord('Record added');
    };

    const handleclick = () => {
        setState(true);
        setButtonState(false);
        setShow(false);
    };

    const changeTicketStatus = (ticketId, status) => {
        console.log(status);
        changeStatus(ticketId,status)
            .then((res) => {
                console.log(res);
                const newStatus = res;
                setTicketStatus(newStatus); // Update ticketStatus state variable
                setRecord("Status Changed");

                // Update the status of the ticket in data state array
                setData(data.map(item => {
                    if (item.ticketId === ticketId) {
                        return { ...item, status: newStatus };
                    } else {
                        return item;
                    }
                }));
            })
            .catch((error) => {
                console.error('Error changing ticket status:', error);
                toast.error("An error occurred while changing ticket status: " + error);
            });
    };

    return (
        <div>
            {buttonState && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-[50px] rounded" onClick={handleclick}>
                    Raise Tickets
                </button>
            )}
            {state && (
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Raise Tickets
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="ticketname" className="block text-sm font-medium leading-6 text-gray-900">
                                    Ticket Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="ticketname"
                                        name="ticketname"
                                        type="text"
                                        value={ticketname}
                                        onChange={(e) => setTicketName(e.target.value)}
                                        autoComplete="ticketname"
                                        required
                                        className="px-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                    Descriptions
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="description"
                                        name="description"
                                        type="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        autoComplete="description"
                                        required
                                        className="px-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="createdBy" className="block text-sm font-medium leading-6 text-gray-900">
                                    CreatedBy 
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="createdBy"
                                        name="createdBy"
                                        type="text"
                                        value={createdBy}
                                        autoComplete="createdBy"
                                        readOnly
                                        className="text-center px-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
           {show && (
    <div className="space-y-4">
        {data.map((item) => (
            <div key={item.ticketId} className="border border-gray-200 p-4 rounded-md">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">{item.ticketname}
                    <div className="text-sm my-5 font-light ">{item.description}</div>
                    </div>
                    
                    <div className="flex space-x-4">
                        <button
                            className={`flex w-20 justify-center rounded-md bg-indigo-600 px-1 py-1.5 my-5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                            onClick={() => changeTicketStatus(item.ticketId,'open')}
                            style={item.status === 'open' ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                            disabled={item.status === 'open'}
                        >
                            Open
                        </button>
                        <button
                            className={`flex w-20 justify-center rounded-md bg-indigo-600 px-1 py-1.5 my-5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                            onClick={() => changeTicketStatus(item.ticketId, 'closed')}
                            style={item.status === 'closed' ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                            disabled={item.status === 'closed'}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
)}
        </div>
    );
};

export default Dashboard;
