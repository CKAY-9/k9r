import { getCommunityDetails } from "@/api/community-details/api";
import { getPersonalUser } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import AdminRootLoginClient from "./client";

const AdminRootLoginPage = async () => {
    const details = await getCommunityDetails();
    
    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);
    
    return (
        <>
            <Header personal_user={personal_user} community_details={details} />
            <main className="container">
                <AdminRootLoginClient />
            </main>
            <Footer community_details={details} />
        </>
    );
}

export default AdminRootLoginPage;