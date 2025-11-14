
import React from 'react';

interface KnowledgeTagsProps {
    tags: string[];
}

export const KnowledgeTags: React.FC<KnowledgeTagsProps> = ({ tags }) => {
    return (
        <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-3">Required Knowledge</h4>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-indigo-300 text-sm font-medium rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};
