<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $this->actingAs($user, 'web');

        $this->get('/dashboard')->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_non_admin_users_can_not_visit_the_dashboard()
    {
        $user = User::factory()->create(['role' => 'user']);
        $this->actingAs($user, 'web');

        $this->get('/dashboard')->assertForbidden();
    }
}
