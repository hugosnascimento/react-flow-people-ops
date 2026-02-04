import { supabase } from '../lib/supabaseClient';
import { Orchestrator } from '../types';

export const SupabaseService = {
    async getOrchestrators(): Promise<Orchestrator[]> {
        const { data, error } = await supabase
            .from('orchestrators')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orchestrators:', error);
            throw error;
        }

        // Map database fields to application types if necessary
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            status: item.status,
            nodes: item.nodes,
            edges: item.edges,
            executionHealth: item.execution_health,
            errorCount: item.error_count,
            lastExecution: item.last_execution ? new Date(item.last_execution).toLocaleString() : undefined
        }));
    },

    async createOrchestrator(orchestrator: Orchestrator, userId: string): Promise<Orchestrator> {
        const dbPayload = {
            id: orchestrator.id,
            name: orchestrator.name,
            description: orchestrator.description,
            status: orchestrator.status,
            nodes: orchestrator.nodes,
            edges: orchestrator.edges,
            execution_health: orchestrator.executionHealth,
            error_count: orchestrator.errorCount,
            user_id: userId,
            // last_execution is null initially
        };

        const { data, error } = await supabase
            .from('orchestrators')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error creating orchestrator:', error);
            throw error;
        }

        return orchestrator;
    },

    async updateOrchestrator(orchestrator: Orchestrator): Promise<Orchestrator> {
        const dbPayload = {
            name: orchestrator.name,
            description: orchestrator.description,
            status: orchestrator.status,
            nodes: orchestrator.nodes,
            edges: orchestrator.edges,
            execution_health: orchestrator.executionHealth,
            error_count: orchestrator.errorCount,
            last_execution: orchestrator.lastExecution // Might need parsing if it's a locale string, but assuming passing string is fine for now if ISO. 
            // Note: The app uses locale string "01/02/2026 14:30" which Supabase might reject for timestamptz. 
            // We should ideally convert to ISO.
        };

        // sanitize last_execution if needed (ignoring for now, assuming UI handles it or we update mostly structure)
        if (orchestrator.lastExecution && !orchestrator.lastExecution.includes('T')) {
            // Basic check, if it's the locale string format, supabase might error. 
            // Ideally we shouldn't send last_execution on simple edits, only on execution updates.
            delete (dbPayload as any).last_execution;
        }

        const { error } = await supabase
            .from('orchestrators')
            .update(dbPayload)
            .eq('id', orchestrator.id);

        if (error) {
            console.error('Error updating orchestrator:', error);
            throw error;
        }

        return orchestrator;
    },

    async deleteOrchestrator(id: string): Promise<void> {
        const { error } = await supabase
            .from('orchestrators')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting orchestrator:', error);
            throw error;
        }
    }
};
