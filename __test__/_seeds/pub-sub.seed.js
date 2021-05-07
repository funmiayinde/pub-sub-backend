/**
 * @return {Object} The user object
 **/
export const getPubSubObject = () => {
    return [
        {
            topic: 'topic1',
            subscribers: [
                'http://test1',
                'http://test2',
            ]
        },
        {
            topic: 'topic2',
            subscribers: [
                'http://test3',
            ]
        }
    ];
};



