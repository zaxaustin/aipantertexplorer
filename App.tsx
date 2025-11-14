import React, { useState, useCallback, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Sources } from './components/Sources';
import { SavedSearches } from './components/SavedSearches';
import { Notes } from './components/Notes';
import { fetchPatentInfo } from './services/geminiService';
import { getSavedSearches, saveSearches } from './services/storageService';
import type { Source, SavedSearch, ChartDataItem } from './types';

const App: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [response, setResponse] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [knowledgeTags, setKnowledgeTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
    const [currentNotes, setCurrentNotes] = useState<string>('');

    useEffect(() => {
        setSavedSearches(getSavedSearches());
    }, []);

    const clearResults = () => {
        setResponse(null);
        setSummary(null);
        setSources([]);
        setChartData([]);
        setKnowledgeTags([]);
        setCurrentNotes('');
    };

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setError("Please enter a topic to search.");
            return;
        }
        setIsLoading(true);
        setError(null);
        clearResults();
        setQuery(searchQuery);

        try {
            const result = await fetchPatentInfo(searchQuery);
            const newSearch: SavedSearch = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                query: searchQuery,
                response: result.text,
                summary: result.summary,
                sources: result.sources,
                chartData: result.chartData,
                knowledgeTags: result.knowledgeTags,
                notes: '',
            };

            setResponse(result.text);
            setSummary(result.summary);
            setSources(result.sources);
            setChartData(result.chartData);
            setKnowledgeTags(result.knowledgeTags);
            setCurrentNotes('');
            setActiveSearchId(newSearch.id);
            
            setSavedSearches(prevSearches => {
                const updatedSearches = [newSearch, ...prevSearches];
                saveSearches(updatedSearches);
                return updatedSearches;
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLoadSearch = useCallback((id: string) => {
        const searchToLoad = savedSearches.find(s => s.id === id);
        if (searchToLoad) {
            setQuery(searchToLoad.query);
            setResponse(searchToLoad.response);
            setSummary(searchToLoad.summary || null);
            setSources(searchToLoad.sources);
            setChartData(searchToLoad.chartData || []);
            setKnowledgeTags(searchToLoad.knowledgeTags || []);
            setCurrentNotes(searchToLoad.notes);
            setActiveSearchId(searchToLoad.id);
            setError(null);
        }
    }, [savedSearches]);

    const handleDeleteSearch = useCallback((id: string) => {
        const updatedSearches = savedSearches.filter(s => s.id !== id);
        setSavedSearches(updatedSearches);
        saveSearches(updatedSearches);

        if (activeSearchId === id) {
            clearResults();
            setActiveSearchId(null);
            setQuery('');
        }
    }, [savedSearches, activeSearchId]);

    const handleSaveNotes = useCallback(() => {
        if (!activeSearchId) return;
        
        const updatedSearches = savedSearches.map(s => 
            s.id === activeSearchId ? { ...s, notes: currentNotes } : s
        );
        setSavedSearches(updatedSearches);
        saveSearches(updatedSearches);
    }, [activeSearchId, currentNotes, savedSearches]);
    
    const handleExportSearch = useCallback(() => {
        const activeSearch = savedSearches.find(s => s.id === activeSearchId);
        if (!activeSearch) return;

        let markdownContent = `# Patent Research: ${activeSearch.query}\n\n`;
        markdownContent += `**Date:** ${new Date(activeSearch.timestamp).toLocaleString()}\n\n`;
        
        if (activeSearch.summary) {
            markdownContent += `## Patent Pulse Summary\n\n_${activeSearch.summary}_\n\n`;
        }

        if (activeSearch.knowledgeTags && activeSearch.knowledgeTags.length > 0) {
            markdownContent += `## Required Knowledge\n\n`;
            markdownContent += `\`${activeSearch.knowledgeTags.join('`, `')}\`\n\n`;
        }
        
        markdownContent += `## Research Findings\n\n${activeSearch.response}\n\n`;
        
        if (activeSearch.sources.length > 0) {
            markdownContent += `## Sources\n\n`;
            activeSearch.sources.forEach(source => {
                markdownContent += `*   [${source.title}](${source.uri})\n`;
            });
            markdownContent += `\n`;
        }

        if (activeSearch.notes) {
            markdownContent += `## Logs & Notes\n\n${activeSearch.notes}\n\n`;
        }

        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeFilename = activeSearch.query.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30);
        a.download = `patent_research_${safeFilename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    }, [activeSearchId, savedSearches]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <header className="text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                            Patent Explorer AI
                        </h1>
                        <p className="mt-2 text-lg text-gray-400">
                            Dive deep into patents, understand the tech, and learn to build prototypes.
                        </p>
                    </header>
                    <SearchForm onSearch={handleSearch} isLoading={isLoading} initialQuery={query} setQuery={setQuery} />
                    <SavedSearches searches={savedSearches} onLoad={handleLoadSearch} onDelete={handleDeleteSearch} activeSearchId={activeSearchId} />
                </div>
                
                <main className="lg:col-span-2 flex flex-col gap-8">
                    {isLoading && <LoadingSpinner />}
                    
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    {response && (
                      <div className="flex flex-col gap-8">
                        <ResultsDisplay 
                            response={response}
                            summary={summary}
                            chartData={chartData}
                            knowledgeTags={knowledgeTags}
                        />
                        <Sources sources={sources} />
                        <Notes 
                            notes={currentNotes} 
                            onNotesChange={setCurrentNotes}
                            onSave={handleSaveNotes}
                            onExport={handleExportSearch}
                            disabled={!activeSearchId}
                        />
                      </div>
                    )}

                    {!isLoading && !response && !error && (
                        <div className="text-center py-10 px-4 bg-gray-800/50 rounded-lg border border-gray-700 h-full flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-gray-300 mb-2">Ready to Explore?</h2>
                            <p className="text-gray-400">Enter a topic, technology, or idea to begin your research, or load a previous session.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;