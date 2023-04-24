export const serviceRequestSteps = [
    {
        id: 1,
        progress : 'queue',
        title: 'Request In Queue',
        status: 'is-complete',
    },
    {
        id: 2,
        progress : 'new',
        title: 'New Request Arrival',
        status: 'is-complete',
    },
    {
        id: 3,
        progress : 'accepted',
        title: 'Request Accepted',
        status: 'is-active',
    },
    {
        id: 4,
        progress : 'rejected',
        title: 'Request Rejected',
        status: '',
    },
    {
        id: 5,
        progress : 'leave_for_the_job',
        title: 'Leave For The Job',
        status: 'is-active',
    },
    {
        id: 6,
        progress : 'ongoing',
        title: 'Task Ongoing',
        status: '',
    },
    {
        id: 7,
        progress : 'quote_provided',
        title: 'Quote Provided',
        status: '',
    },
    {
        id: 8,
        progress : 'quote_accepted',
        title: 'Quote Accepted',
        status: '',
    },
    {
        id: 9,
        progress : 'quote_rejected',
        title: 'Quote Rejected',
        status: '',
    },

    {
        id: 10,
        progress : 'task_done',
        title: ' Task Done By Service Provider',
        status: '',
    },
    {
        id: 11,
        progress : 'payment_done',
        title: 'Payment Done By Customer',
        status: '',
    },
    {
        id: 12,
        progress : 'customer_review',
        title: 'Review Given By Customer',
        status: 'is-complete',
    },
    {
        id:13,
        progress : 'journey_cancelled',
        title : 'Request cancel',
        status : ''
    }
 ];