import Link from 'next/link'
import { User } from 'firebase/auth'

interface NavItemProps {
    mobile?: boolean
    handleAuth: () => void
    userName: string | null
}

const NavItem = ({ mobile, handleAuth, userName }: NavItemProps) => {
    const commonClasses = "flex items-center space-x-4"
    const mobileClasses = mobile ? "flex-col space-y-4 pb-4 pt-2" : ""

    return (
        <div className={`${commonClasses} ${mobileClasses}`}>
            {userName ? (
                <>
                    <span>Welcome, {userName}!</span>
                    <button
                        onClick={handleAuth}
                        className="hover:text-blue-300 transition-colors"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <button
                    onClick={handleAuth}
                    className="hover:text-blue-300 transition-colors"
                >
                    Sign In
                </button>
            )}
        </div>
    )
}

export default NavItem