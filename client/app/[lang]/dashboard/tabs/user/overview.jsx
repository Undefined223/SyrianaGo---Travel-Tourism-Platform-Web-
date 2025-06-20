import { Calendar, Heart } from 'lucide-react';
import { useUser } from "@/app/contexts/UserContext";
import { getUserBookings, getUserRecentActivities } from '@/app/lib/https/auth.https';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function UserOverview() {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    getUserBookings().then(setBookings).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    setActivityLoading(true);
    getUserRecentActivities(user._id, language)
      .then(setRecentActivity)
      .finally(() => setActivityLoading(false));
  }, [user?._id, language]);
  console.log('recentActivity', recentActivity);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('user.overview')}</h1>
      <div className="mb-6">
        <p className="text-gray-700">
          {t('dashboard.welcome', { name: user?.name || t('user.user') })}
        </p>
        <p className="text-gray-500 text-sm">{t('dashboard.summary')}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-500" />
          <div>
            <div className="text-lg font-bold">{bookings?.length}</div>
            <div className="text-xs text-gray-500">{t('user.bookings')}</div>
          </div>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 flex items-center space-x-3">
          <Heart className="w-6 h-6 text-pink-500" />
          <div>
            <div className="text-lg font-bold">{user?.wishlist.length}</div>
            <div className="text-xs text-gray-500">{t('user.wishlist')}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t('user.recentActivity')}</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div>
                {activity.detailKey
                  ? t(activity.detailKey, activity.detailParams)
                  : ""}
              </div>
              <span className="text-xs text-gray-400">{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}