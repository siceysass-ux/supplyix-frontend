import React from 'react';

interface ExpiredSubscriptionBannerProps {
    onRenew: () => void;
}

const ExpiredSubscriptionBanner: React.FC<ExpiredSubscriptionBannerProps> = ({ onRenew }) => {
    return (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                            Aboneliğiniz Sona Erdi
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            Yeni siparişler oluşturmak ve tüm özelliklere erişmek için planınızı yenileyin.
                            Geçmiş verilerinize erişmeye devam edebilirsiniz.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onRenew}
                    className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                    Planı Yenile
                </button>
            </div>
        </div>
    );
};

export default ExpiredSubscriptionBanner;
