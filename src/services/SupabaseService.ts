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
            // Fallback for demo/dev if DB is not reachable or empty
        }

        // If no data found, return default seed data for immediate visualization
        if (!data || data.length === 0) {
            console.warn("No orchestrators found in DB. Serving default mock data.");
            return [
                {
                    id: 'o-master-lifecycle',
                    name: 'Full Employee Lifecycle (Master)',
                    description: 'End-to-end flow: Recruitment -> Admission -> Onboarding (Branched) -> Training -> Retention -> Offboarding.',
                    status: 'published',
                    executionHealth: 100,
                    errorCount: 0,
                    lastExecution: new Date().toISOString(),
                    nodes: [
                        // 1. RECRUITMENT & ADMISSION
                        { "id": "trigger_ats", "type": "trigger", "position": { "x": 0, "y": 400 }, "data": { "label": "ATS: Offer Accepted", "method": "POST", "endpoint": "/hooks/greenhouse/offer", "integrationActive": true } },
                        { "id": "register_eva", "type": "registerEmployee", "position": { "x": 350, "y": 400 }, "data": { "label": "Register in Eva", "system": "Eva People" } },

                        // 2. CONTRACT TYPE BRANCHING (ADMISSION)
                        { "id": "cond_contract", "type": "conditional", "position": { "x": 700, "y": 400 }, "data": { "label": "Contract Type?", "switchField": "contract_type", "rules": [{ "id": "clt", "label": "CLT", "value": "clt", "operator": "equals" }, { "id": "pj", "label": "PJ/B2B", "value": "pj", "operator": "equals" }, { "id": "intern", "label": "Intern", "value": "intern", "operator": "equals" }] } },

                        // Branches
                        { "id": "setup_benefits", "type": "systemUpdate", "position": { "x": 1100, "y": 200 }, "data": { "label": "Setup Benefits (Flash)", "system": "Flash Benefits", "action": "create_account", "payload": "{ \"plan\": \"gold\" }" } },
                        { "id": "validate_pj", "type": "humanInTheLoop", "position": { "x": 1100, "y": 400 }, "data": { "label": "Validate CNPJ", "assignee": "Legal Team", "description": "Check if company setup is valid.", "timeout": 24 } },
                        { "id": "university_doc", "type": "humanInTheLoop", "position": { "x": 1100, "y": 600 }, "data": { "label": "Sign Internship Agree.", "assignee": "HR Ops", "description": "Collect signature from University.", "timeout": 48 } },

                        // Converge - PROVISIONING
                        { "id": "prov_access", "type": "systemUpdate", "position": { "x": 1500, "y": 400 }, "data": { "label": "Prov. Access (SSO)", "system": "Okta", "action": "create_user", "payload": "{ \"groups\": \"all_staff\" }" } },

                        // 3. ONBOARDING & TRAINING BRANCHING (ROLE)
                        { "id": "delay_day1", "type": "delay", "position": { "x": 1850, "y": 400 }, "data": { "label": "Wait for Day 1", "delayValue": 1, "delayUnit": "days" } },
                        { "id": "cond_role", "type": "conditional", "position": { "x": 2200, "y": 400 }, "data": { "label": "Department?", "switchField": "department", "rules": [{ "id": "tech", "label": "Tech", "value": "tech", "operator": "equals" }, { "id": "sales", "label": "Sales", "value": "sales", "operator": "equals" }] } },

                        // Role Branches
                        { "id": "train_tech", "type": "systemUpdate", "position": { "x": 2600, "y": 250 }, "data": { "label": "Assign Eng. Bootcamp", "system": "Qulture.Rocks", "action": "enroll_track", "payload": "{ \"track_id\": \"eng_101\" }" } },
                        { "id": "train_sales", "type": "systemUpdate", "position": { "x": 2600, "y": 550 }, "data": { "label": "Assign Sales Academy", "system": "Qulture.Rocks", "action": "enroll_track", "payload": "{ \"track_id\": \"sales_101\" }" } },

                        // 4. RECURRING CHECKS (Tagging & Reviews)
                        { "id": "tag_active", "type": "tagManager", "position": { "x": 3000, "y": 400 }, "data": { "label": "Tag: Active Employee", "addTag": "Active", "removeTag": "Pre-Hire" } },

                        { "id": "wait_45", "type": "delay", "position": { "x": 3350, "y": 400 }, "data": { "label": "Wait 45 Days", "delayValue": 45, "delayUnit": "days" } },
                        { "id": "eval_45", "type": "humanInTheLoop", "position": { "x": 3700, "y": 400 }, "data": { "label": "45-Day Review", "assignee": "Manager", "description": "Mid-probation review.", "timeout": 72 } },

                        { "id": "wait_90", "type": "delay", "position": { "x": 4100, "y": 400 }, "data": { "label": "Wait 90 Days", "delayValue": 45, "delayUnit": "days" } },
                        { "id": "eval_90", "type": "humanInTheLoop", "position": { "x": 4450, "y": 400 }, "data": { "label": "90-Day Probation Decision", "assignee": "Manager & HRBP", "description": "Final decision: Pass or Fail probation.", "timeout": 72 } },

                        // 5. OFFBOARDING HANDOFF
                        { "id": "cond_off", "type": "conditional", "position": { "x": 4850, "y": 400 }, "data": { "label": "Pass Probation?", "switchField": "probation_result", "rules": [{ "id": "pass", "label": "Yes (Pass)", "value": "pass", "operator": "equals" }, { "id": "fail", "label": "No (Fail)", "value": "fail", "operator": "equals" }] } },

                        { "id": "tag_perm", "type": "tagManager", "position": { "x": 5250, "y": 250 }, "data": { "label": "Tag: Permanent", "addTag": "Permanent", "removeTag": "Probation" } },
                        { "id": "trigger_off", "type": "triggerWorkflow", "position": { "x": 5250, "y": 550 }, "data": { "label": "Trigger Offboarding", "workflowId": "o-offboarding-v1" } }
                    ],
                    edges: [
                        // Recruitment -> Reg -> Contract Branch
                        { "id": "e1", "source": "trigger_ats", "target": "register_eva", "animated": true, "style": { "stroke": "#ff5a1f", "strokeWidth": 3 } },
                        { "id": "e2", "source": "register_eva", "target": "cond_contract", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },

                        // Contract Branches
                        { "id": "e3", "source": "cond_contract", "sourceHandle": "clt", "target": "setup_benefits", "animated": true, "label": "CLT", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                        { "id": "e4", "source": "cond_contract", "sourceHandle": "pj", "target": "validate_pj", "animated": true, "label": "PJ", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                        { "id": "e5", "source": "cond_contract", "sourceHandle": "intern", "target": "university_doc", "animated": true, "label": "Intern", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },

                        // Converge to Provisioning
                        // Note: To converge visually cleanly, we link all branches to 'prov_access'
                        { "id": "e6", "source": "setup_benefits", "sourceHandle": "success", "target": "prov_access", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                        { "id": "e7", "source": "validate_pj", "sourceHandle": "approved", "target": "prov_access", "animated": true, "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                        { "id": "e8", "source": "university_doc", "sourceHandle": "approved", "target": "prov_access", "animated": true, "style": { "stroke": "#10b981", "strokeWidth": 3 } },

                        // Prov -> Day 1 -> Role Branch
                        { "id": "e9", "source": "prov_access", "sourceHandle": "success", "target": "delay_day1", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
                        { "id": "e10", "source": "delay_day1", "target": "cond_role", "animated": true, "style": { "stroke": "#d97706", "strokeWidth": 3 } },

                        // Role Branches
                        { "id": "e11", "source": "cond_role", "sourceHandle": "tech", "target": "train_tech", "animated": true, "label": "Tech", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                        { "id": "e12", "source": "cond_role", "sourceHandle": "sales", "target": "train_sales", "animated": true, "label": "Sales", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },

                        // Converge to Tagging
                        { "id": "e13", "source": "train_tech", "sourceHandle": "success", "target": "tag_active", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
                        { "id": "e14", "source": "train_sales", "sourceHandle": "success", "target": "tag_active", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },

                        // Recurring Checks
                        { "id": "e15", "source": "tag_active", "target": "wait_45", "animated": true, "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                        { "id": "e16", "source": "wait_45", "target": "eval_45", "animated": true, "style": { "stroke": "#d97706", "strokeWidth": 3 } },
                        { "id": "e17", "source": "eval_45", "sourceHandle": "approved", "target": "wait_90", "animated": true, "label": "On Track", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                        // (Optional: handle rejected 45 day -> PIP?)

                        { "id": "e18", "source": "wait_90", "target": "eval_90", "animated": true, "style": { "stroke": "#d97706", "strokeWidth": 3 } },
                        { "id": "e19", "source": "eval_90", "sourceHandle": "approved", "target": "cond_off", "animated": true, "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                        { "id": "e20", "source": "eval_90", "sourceHandle": "rejected", "target": "cond_off", "animated": true, "style": { "stroke": "#f43f5e", "strokeWidth": 3 } },

                        // Final Decision
                        { "id": "e21", "source": "cond_off", "sourceHandle": "pass", "target": "tag_perm", "animated": true, "label": "Pass", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                        { "id": "e22", "source": "cond_off", "sourceHandle": "fail", "target": "trigger_off", "animated": true, "label": "Fail", "style": { "stroke": "#f43f5e", "strokeWidth": 3 } }
                    ]
                }
            ];
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
