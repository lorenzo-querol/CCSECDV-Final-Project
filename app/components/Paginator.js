import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

export default function Paginator({ handleNext, handlePrev, page, totalPages, totalReports, limit }) {
    return (
        <div className="flex flex-col items-center">
            {/* Help text */}
            <span className="text-sm text-indigo-700 dark:text-indigo-400">
                Showing{' '}
                <span className="font-semibold text-indigo-900 dark:text-white">
                    {Math.min((page - 1) * limit + 1, totalReports)}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-indigo-900 dark:text-white">
                    {Math.min(page * limit, totalReports)}
                </span>{' '}
                of <span className="font-semibold text-indigo-900 dark:text-white">{totalReports}</span> Reported Users
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
                <button
                    className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-indigo-800 rounded-l hover:bg-indigo-900 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-700 dark:hover:text-white"
                    onClick={handlePrev}
                    disabled={page === 1}
                >
                    <AiOutlineArrowLeft size={20} />
                </button>
                <button
                    className="flex items-center justify-center h-8 px-3 text-sm font-medium text-white bg-indigo-800 border-0 border-l border-indigo-700 rounded-r hover:bg-indigo-900 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-700 dark:hover:text-white"
                    onClick={handleNext}
                    disabled={page === totalPages}
                >
                    <AiOutlineArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
