const API_ENDPOINTS = {
    CANDIDATE_CREATE_PROFILE: 'candidate/createprofile',
    CANDIDATE_GET_PROFILE: 'candidate/getprofile',
    CANDIDATE_SAVE_VIDEO: 'candidate/savevideo',
    RECRUITER_CANDIDATE_DATA: 'candidate/get_Recruiter_CandidateData',
    RECRUITER_CREATE_PROFILE: 'recuiter/createprofile',
    RECRUITER_GET_PROFILE: 'recuiter/getprofile',
    CANDIDATE_GET_DASHBOARD: 'cvConverter/compare_candiateProfile_with_JobProfile',
    RECUITER_GET_DASHBOARD: 'cvConverter/compare_RecuiterProfile_with_CandidateProfile',
    get_Candiate_Recuiter_Matched:'match/getCandiateMatchedDetails',
    end_Chat:'match/closeChat',
    sendNotification:'match/sendNotification'
};

export default API_ENDPOINTS;
