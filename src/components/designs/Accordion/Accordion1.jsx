import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    color: '#6b7280',
    fontWeight: '500',
    fontSize: '0.8rem',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Accordion1({ item, level }) {
    const [expanded, setExpanded] = useState('');
    const navigate = useNavigate();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleClick = (data) => {
        navigate(`/geneology/tree/${data?._id}`);
    }

    return (
        <div>
            <Accordion expanded={expanded === item} onChange={handleChange(item)}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography className='text-sm text-gray-500 font-medium'>Level {level} Total Members: {item?.length}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        item?.map((member, index) =>
                            <div className={`text-sm font-medium cursor-pointer hover:text-blue-500 px-4 py-1 ${member?.accountStatus === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`} key={index} onClick={() => handleClick(member)}>
                                {member?.fullName} MemberId: {member?.userId}
                            </div>
                        )
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    );
}