package uj.wmii.jwzp.hardwarerent.services.impl;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uj.wmii.jwzp.hardwarerent.data.MyUser;
import uj.wmii.jwzp.hardwarerent.data.Privilege;
import uj.wmii.jwzp.hardwarerent.data.Role;
import uj.wmii.jwzp.hardwarerent.data.UserProfile;
import uj.wmii.jwzp.hardwarerent.repositories.RoleRepository;
import uj.wmii.jwzp.hardwarerent.repositories.UserRepository;
import uj.wmii.jwzp.hardwarerent.services.interfaces.UserDetailsService;

import java.util.*;

@Service
@Transactional
public class MyUserDetailsService implements UserDetailsService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    public MyUserDetailsService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public MyUser loadUserByUsername(String username) {
        MyUser user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return user;
    }
    public UserProfile getUserProfileByUsername(String username){
        MyUser user = loadUserByUsername(username);
        return new UserProfile(user.getUsername(),user.getFirstName(), user.getLastName(),user.getEmail());
    }
    public Collection<? extends GrantedAuthority> getAuthorities(
            Collection<Role> roles) {

        return getGrantedAuthorities(getPrivileges(roles));
    }

    private List<String> getPrivileges(Collection<Role> roles) {

        List<String> privileges = new ArrayList<>();
        List<Privilege> collection = new ArrayList<>();
        for (Role role : roles) {
            privileges.add(role.getName());
            collection.addAll(role.getPrivileges());
        }
        for (Privilege item : collection) {
            privileges.add(item.getName());
        }
        return privileges;
    }

    private List<GrantedAuthority> getGrantedAuthorities(List<String> privileges) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (String privilege : privileges) {
            authorities.add(new SimpleGrantedAuthority(privilege));
        }
        return authorities;
    }
}
