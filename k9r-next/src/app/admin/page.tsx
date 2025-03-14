import { getCommunityDetails } from "@/api/community-details/api";
import { SITE_SETTINGS, usergroupsPermissionFlagCheck } from "@/api/permissions";
import { getPersonalUser, getUserUserGroupsFromID } from "@/api/users/api";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getStoredCookie } from "@/utils/stored-cookies";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminHomeClient from "./client";

export const generateMetadata = async (): Promise<Metadata> => {
    const details = await getCommunityDetails();
    return {
        title: `Admin Panel - ${details.name}`,
        description: `Admin control panel for ${details.name}. ${details.description}`,
    };
}

const AdminHomePage = async () => {
    const details = await getCommunityDetails();

    const user_token = await getStoredCookie("token");
    const personal_user = await getPersonalUser(user_token);
    
    if (personal_user === null) {
        return redirect(`/user/login`);
    }

    const usergroups = await getUserUserGroupsFromID(personal_user.id);
    const permission_check = usergroupsPermissionFlagCheck(usergroups, SITE_SETTINGS);
    if (!permission_check) {
        return redirect(`/`);
    }

    return (
        <>
            <Header community_details={details} personal_user={personal_user} />
            <main className="container">
                <AdminHomeClient personal_user={personal_user} usergroups={usergroups} />
            </main>
            <Footer community_details={details} />
        </>
    );
}

export default AdminHomePage;