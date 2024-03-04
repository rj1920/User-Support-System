import React, { useEffect, useState } from 'react';
import { answerTicket, closeTicket, getAllTickets } from '../services/techSupportService';
import { toast } from 'react-toastify';
import { Popup } from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Support = () => {
    const [data, setData] = useState([]);
    const [buttonStates, setButtonStates] = useState({});
    const [answer, setAnswer] = useState('');

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
        };

        fetchData();
    }, []);

    const handleclick = (ticketId) => {
        setButtonStates({ ...buttonStates, [ticketId]: true });
    };

    const handleSubmit = (event, ticketId) => {
        event.preventDefault();
        setButtonStates({ ...buttonStates, [ticketId]: false });

        const generatedAnswer = {
            answer
        }

        answerTicket(ticketId, generatedAnswer)
            .then((res) => {
                console.log(res);
                toast.success("Ticket Answered Successfully..!! ")
            })
            .catch((e) => {
                console.log(e);
                toast.error("An error occurred while submitting: " + e);
            });

        setAnswer('');
    };

    const changeTicketStatus = (ticketId) => {
        closeTicket(ticketId)
            .then((res) => {
                console.log(res);
                const newStatus = res;
                
                setData(data.map(item => {
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
            <h1 className='m-10 text-center font-extrabold'>Supports Page</h1>
            {data.map((item) => (
                <div key={item.ticketId} className="border border-gray-200 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-bold">{item.ticketname}
                            <div className="text-sm my-5 font-light ">{item.description}</div>
                            <div className="text-sm my-5 font-bold bg-blue-600 text-white px-2 py-1 rounded"><h1>created By</h1>{item.createdBy}</div>
                        </div>

                        <div className="flex space-x-4">
                            {!buttonStates[item.ticketId] && (
                                <button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-[50px] rounded" onClick={() => handleclick(item.ticketId)}>
                                    Answer
                                </button>
                            )}
                            {buttonStates[item.ticketId] && (
                                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                            Answer
                                        </h2>
                                    </div>
                                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                                        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, item.ticketId)}>
                                            <div>
                                                <label htmlFor="answer" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Description
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        id="answer"
                                                        name="answer"
                                                        type="text"
                                                        value={answer}
                                                        onChange={(e) => setAnswer(e.target.value)}
                                                        autoComplete="answer"
                                                        required
                                                        className="px-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

                        </div>
                        <div>

                        <button
                                className={`flex w-20 justify-center rounded-md bg-red-600 px-1 py-1.5 my-5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                onClick={() => changeTicketStatus(item.ticketId)}
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
    );
};

export default Support;
